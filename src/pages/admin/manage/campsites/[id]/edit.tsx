import Navbar from "@/app/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiRequest from "@/lib/axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface AmenityInterface {
  id: number;
  name: string;
}

interface CampsiteInterface {
  id: number;
  site_number: string;
  description: string;
  coordinates: string;
  price_per_night: string;
  max_occupancy: string;
  amenities: AmenityInterface[];
}

interface FormDataInterface {
  site_number: string;
  description: string;
  coordinates: string;
  price_per_night: string;
  max_occupancy: string;
  amenities: number[]; 
}

const CampsiteEdit = () => {
  const router = useRouter();
  const { token } = useAppContext() as { token: string };
  const { id: campId } = router.query;

  const [formData, setFormData] = useState<FormDataInterface>({
    site_number: "",
    description: "",
    coordinates: "",
    price_per_night: "",
    max_occupancy: "",
    amenities: [],
  });

  const { data: campsite, isLoading } = useQuery<CampsiteInterface>({
    queryKey: ["management campground", campId, token],
    queryFn: async () => {
      apiRequest.defaults.headers.common["Authorization"] = `Token ${token}`;
      const { data } = await apiRequest.get<CampsiteInterface>(
        `campsites/${campId}`
      );
      return data;
    },
    enabled: !!token && !!campId,
  });

  useEffect(() => {
    if (campsite) {
      setFormData({
        site_number: campsite.site_number,
        description: campsite.description,
        coordinates: campsite.coordinates,
        price_per_night: campsite.price_per_night,
        max_occupancy: campsite.max_occupancy,
        amenities: campsite.amenities.map((amenity) => amenity.id),
      });
    }
  }, [campsite]);

  const mutation = useMutation({
    mutationFn: async (updatedCampsite: FormDataInterface) => {
      apiRequest.defaults.headers.common["Authorization"] = `Token ${token}`;
      const { data } = await apiRequest.put(
        `campsites/${campId}`,
        updatedCampsite
      );
      return data;
    },
    onSuccess: () => {
      router.push("/admin/manage/campsites");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (!campsite && !isLoading) 
    return <div className="text-center p-8">Campsite not found</div>;

  return (
    <div className="flex justify-center w-full h-full p-4">
      <div className="border rounded-lg shadow-lg p-6 mt-6 bg-white w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Campsite</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="site_number">
              Site Number:
            </label>
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
            <label className="block mb-1 font-semibold" htmlFor="description">
              Description:
            </label>
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
            <label className="block mb-1 font-semibold" htmlFor="coordinates">
              Coordinates:
            </label>
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
            <label
              className="block mb-1 font-semibold"
              htmlFor="price_per_night"
            >
              Price per Night:
            </label>
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
            <label className="block mb-1 font-semibold" htmlFor="max_occupancy">
              Max Occupancy:
            </label>
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
          <AmenitySelect
            token={token}
            selectedAmenities={formData.amenities}
            setSelectedAmenities={(amenities) =>
              setFormData((prev) => ({ ...prev, amenities }))
            }
          />
          <button
            type="submit"
            className="button w-full mt-4 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition"
          >
            Update Campsite
          </button>
        </form>
      </div>
    </div>
  );
};

interface AmenitySelectProps {
  token: string;
  selectedAmenities: number[];
  setSelectedAmenities: (amenities: number[]) => void;
}

const AmenitySelect = ({
  token,
  selectedAmenities,
  setSelectedAmenities,
}: AmenitySelectProps) => {
  const { data: amenities, isLoading } = useQuery<AmenityInterface[]>({
    queryKey: ["amenities", token],
    queryFn: async () => {
      apiRequest.defaults.headers.common["Authorization"] = `Token ${token}`;
      const { data } = await apiRequest.get<AmenityInterface[]>("campsites/amenities");
      return data;
    },
    enabled: !!token,
  });

  const handleChange = (amenityId: number) => {
    if (selectedAmenities.includes(amenityId)) {
      setSelectedAmenities(
        selectedAmenities.filter((id) => id !== amenityId)
      );
    } else {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    }
  };

  if (isLoading) return <div>Loading amenities...</div>;
  if (!amenities) return null;

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Amenities</h3>
      <div className="space-y-2">
        {amenities.map(({ id, name }) => (
          <div key={id} className="flex items-center">
            <input
              type="checkbox"
              id={`amenity-${id}`}
              checked={selectedAmenities.includes(id)}
              onChange={() => handleChange(id)}
              className="mr-2"
            />
            <label htmlFor={`amenity-${id}`}>{name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

CampsiteEdit.getLayout = function getLayout(page) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{page}</main>
    </div>
  );
};

export default CampsiteEdit;
