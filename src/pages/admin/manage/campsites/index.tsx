import Navbar from "@/app/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/lib/axios";
import { useRouter } from "next/router";
import { formatUSD } from "@/utils/currency_formatter";

const CampsiteManagement = () => {
    const router = useRouter();
    const { token } = useAppContext() as { token: string };
    
    const { data: campsites } = useQuery({
        queryKey: ['management campgrounds', token],
        queryFn: async () => {
            apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
            const { data } = await apiRequest.get('campsites');
            return data;
        },
        enabled: !!token, // Only fetch if token exists
    });


    if (!campsites) return null; // Early return if campsites data is not available

    return (
        <div className='w-full h-full p-4'>
            <h1 className='text-center text-4xl font-bold mt-4'>Campsite Management</h1>
            <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {campsites.map((site) => (
                    <div key={site.id} className="border rounded-lg shadow-lg p-4 bg-white">
                        <h2 className="text-xl font-semibold">{site.site_number}</h2>
                        <p className="text-gray-700">{site.description}</p>
                        <p className="text-gray-600"><strong>Coordinates:</strong> {site.coordinates}</p>
                        <p className="text-gray-600"><strong>Price per Night:</strong> {formatUSD(site.price_per_night)}</p>
                        <p className="text-gray-600"><strong>Max Occupancy:</strong> {site.max_occupancy}</p>
                        
                        <button 
                            onClick={() => router.push(`/admin/manage/campsites/${site.id}/edit?`)} 
                            className="button w-full mt-4 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition"
                        >
                            Edit
                        </button>

                        {site.images && site.images.length > 0 && (
                            <div className="mt-4">
                                <img className="w-full h-auto rounded" src={site.images[0].image_url} alt={site.id} />
                            </div>
                        )}

                        <div className="mt-2">
                            <h3 className="font-semibold">Amenities:</h3>
                            {site.amenities?.map(({name, id}) => (
                      <div 
                          key={id}
                          className='flex items-center overflow-scroll rounded-lg border bg-blue-500/90 p-1 text-white transition duration-300 hover:bg-blue-600'
                      >
                          <span className="mr-1">
                              {/* Replace with appropriate icons */}
                              <i className={`icon-${name.toLowerCase()}`}></i> 
                          </span>
                          {name}
                      </div>
                                  ))}
                              </div>

                              <div className="mt-2">
                                  <h3 className="font-semibold">Reviews:</h3>
                                  {site.reviews?.map((r) => (
                                      <p key={r.id} className="text-gray-600">"{r.comment}" by {r.username}</p>
                                  ))}
                              </div>
                          </div>
                ))}
            </div>
        </div>
    );
};

CampsiteManagement.getLayout = function getLayout(page) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow">{page}</main>
        </div>
    );
};

export default CampsiteManagement;

