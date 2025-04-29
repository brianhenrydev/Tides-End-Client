export interface CampSite {
    id: number;
    site_number: string;
    description?: string;
    coordinates: string;
    price_per_night: string;
    max_occupancy: number;
    available: boolean;
    created_at?: string;
    updated_at?: string;
    amineties?: Aminety[];
    images: ImageInterface[];
}
interface Aminety {
  id: number;
  name: string;
}

export interface ImageInterface {
    id: number;
    image_url: string;
    uploaded_at?: string;
    campsite?: number;
}

export interface Campground {
    campgrounds: CampSite[];
}

export interface ReservationInterface {
  id: number;
  campsite: CampSite;
  check_in_date: string;
  check_out_date: string;
  status: string;
}

export interface ReviewInterface {
    id: number;
    username?: string;
    camper: CamperInterface;
    campground: CampSite;
    rating?: number;
    comment?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CamperInterface {
    id: number;
}
