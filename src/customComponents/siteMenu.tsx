import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useNavigate } from 'react-router-dom';


export default function MenubarDemo() {

    const navigate = useNavigate();
  
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Menu</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => navigate('/home')}>
            Home
          </MenubarItem>

          <MenubarSeparator></MenubarSeparator>

          <MenubarItem onClick={() => navigate('/search')}>
            Search
          </MenubarItem>
 
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
