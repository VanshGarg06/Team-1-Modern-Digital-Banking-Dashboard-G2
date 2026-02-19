import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import VantaBackground from '../VantaBackground';

const MainLayout = () => {
  return (
    <VantaBackground>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 ml-[280px] transition-all duration-300 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </VantaBackground>
  );
};

export default MainLayout;
