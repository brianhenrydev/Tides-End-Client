import Navbar from "@/app/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiRequest from "@/lib/axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const CampsiteEdit = () => {
    const router = useRouter();
    const { token } = useAppContext() as { token: string };
    const { id: campId } = router.query;

    const { data: campsite } = useQuery({
        queryKey: ['management campground', campId, token],
        queryFn: async () => {
            apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
            const { data } = await apiRequest.get(`campsites/${campId}`);
            return data;
        },
        enabled: !!token,
    });

    const mutation = useMutation({
        mutationFn: async (updatedCampsite) => {
            apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
            const { data } = await apiRequest.put(`campsites/${campId}`, updatedCampsite);
            return data;
        },
        onSuccess: () => {
            router.push("/admin/manage/campsites")
        },
    });

    const [formData, setFormData] = useState({
        site_number: '',
        description: '',
        coordinates: '',
        price_per_night: '',
        max_occupancy: '',
    });

    useEffect(() => {
        if (campsite) {
            setFormData({
                site_number: campsite.site_number,
                description: campsite.description,
                coordinates: campsite.coordinates,
                price_per_night: campsite.price_per_night,
                max_occupancy: campsite.max_occupancy,
            });
        }
    }, [campsite]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (!campsite) return null; 

    return (
  <div className='flex justify-center w-full h-full p-4'>
        <div className="border rounded-lg shadow-lg p-6 bg-white w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Campsite</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold" htmlFor="site_number">Site Number:</label>
                    <input
                        type="text"
                        id="site_number"
                        name="site_number"
                        value={formData.site_number}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold" htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold" htmlFor="coordinates">Coordinates:</label>
                    <input
                        type="text"
                        id="coordinates"
                        name="coordinates"
                        value={formData.coordinates}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold" htmlFor="price_per_night">Price per Night:</label>
                    <input
                        type="number"
                        id="price_per_night"
                        name="price_per_night"
                        value={formData.price_per_night}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold" htmlFor="max_occupancy">Max Occupancy:</label>
                    <input
                        type="number"
                        id="max_occupancy"
                        name="max_occupancy"
                        value={formData.max_occupancy}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <button type="submit" className="button w-full mt-4 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition">
                    Update Campsite
                </button>
            </form>
        </div>
    </div>
  )

}

  
CampsiteEdit.getLayout = function getLayout(page) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{page}</main>
    </div>
  );
};

export default CampsiteEdit
