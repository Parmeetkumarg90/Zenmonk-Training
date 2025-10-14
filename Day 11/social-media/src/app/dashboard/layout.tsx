import style from "./style.module.css";
import Card from "@mui/material/Card";
import LeftPanel from '@/components/dashboard/left/left-panel';
import MainPanel from '@/components/dashboard/main/main-panel';
import RightPanel from '@/components/dashboard/right/right-panel';

const Dashboard = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <Card className={`${style.card} ${style.grid}`}>
            <LeftPanel />
            {children}
            <RightPanel />
        </Card>
    );
}

export default Dashboard;