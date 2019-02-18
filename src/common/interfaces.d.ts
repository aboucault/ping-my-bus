interface IBusProps { 
    id: string;
    name: string;
    avatar: string;
    direction: string;
    times: ITimeProps[];
}

interface ITimeProps {
    schedule: string;
    hurry: boolean;
}
