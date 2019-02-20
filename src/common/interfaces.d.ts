interface IBusProps { 
    id: string;
    avatar: string;
    direction: string;
    favorite: boolean;
    manageFavorite: (id: string) => void;
    name: string;
    times: ITimeProps[];
}

interface ITimeProps {
    schedule: string;
    hurry: boolean;
    hurryNow: boolean;
}
