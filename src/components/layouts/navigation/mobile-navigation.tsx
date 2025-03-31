import { useUI } from '@/contexts/ui.context';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Drawer from '@/components/ui/drawer';

const MobileNavigation: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { displaySidebar, closeSidebar } = useUI();

  return (
    <Drawer open={displaySidebar} onClose={closeSidebar} variant="left">
      <DrawerWrapper onClose={closeSidebar}>{children}</DrawerWrapper>
    </Drawer>
  );
};
export default MobileNavigation;
