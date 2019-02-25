interface IBusProps { 
    id: string;
    avatar: string;
    direction: string;
    favorite: boolean;
    name: string;
    times: ITimeProps[];
}

interface ITimeProps {
    schedule: string;
    hurry: boolean;
}
