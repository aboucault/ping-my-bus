// Components Props

interface IBusProps { 
    id: string;
    avatar: string;
    direction: string;
    favorite: boolean;
    manageFavorite: (id: string) => void;
    name: string;
    times: ITimeProps[];
}

interface IStopListProps {
    getPhysicalStops: (name: string) => void;
    stops: IStopList[];
}

// ---

// Backend features

interface IBackendFeatures {
    type: string;
    features: IStop[];
}

// Stops

interface IStopList {
    city: string;
    codes: string[];
    label: string;
    isDupplicate?: boolean;
}

interface IStop {
    properties: IStopProperties;
    geometry: IStopGeometry;
}

interface IStopGeometry {
    type: string;
    coordinates: number[];
}

interface IStopProperties {
    CODE: string;
    id: string;
    LIBELLE: string;
    COMMUNE: string;
    arr_visible: string;
    type: string;
    LaMetro: boolean;
    LeGresivaudan: boolean;
    PaysVoironnais: boolean;
}

// Time

interface ITimeProps {
    schedule: string;
    hurry: boolean;
    hurryNow: boolean;
}
