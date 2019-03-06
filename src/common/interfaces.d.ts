interface IBackendFeatures {
    type: string;
    features: IStop[];
}

interface IBusProps { 
    id: string;
    avatar: string;
    direction: string;
    favorite: boolean;
    manageFavorite: (id: string) => void;
    name: string;
    times: ITimeProps[];
}

interface IStopList {
    city: string;
    codes: string[];
    label: string;
    isDupplicate?: boolean;
}

interface IStopListProps {
    stops: IStopList[];
}

interface IStop {
    properties: IStopPropertiesProps;
    geometry: IStopGeometryProps;
}

interface IStopGeometryProps {
    type: string;
    coordinates: number[];
}

interface IStopPropertiesProps {
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

interface ITimeProps {
    schedule: string;
    hurry: boolean;
    hurryNow: boolean;
}
