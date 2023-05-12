import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './drawer.scss';
import CustomIcons from './Icons';


export interface ISubMenuItem {
  value: any;
  label: string;
  key: string;
  icon?: any;
  submenus?: any;
}

export interface IMenuItem extends ISubMenuItem {
  submenus: ISubMenuItem[];
}


export interface IConfigProps {
  customClass?: string;
  currentKey?: string;
}

export interface IDrawerProps {
  menuItems: IMenuItem[];
  menuLocation?: any;
  onSubMenuClick: any;
  showMenuBar: boolean;
  config?: IConfigProps;
  subMenuAct: string;   // hover || click
}

export const Drawer = (props: IDrawerProps) => {
  const { menuItems, onSubMenuClick, showMenuBar, config, subMenuAct } = props;
  const currentKey = config && config.currentKey;
  const customClass = config && config.customClass;
  const [showSubMenu, setShowSubMenu] = useState<boolean>(false);
  const [activeMenuInfo, setActiveMenuInfo] = useState<any>(null);
  const drawerRef: React.RefObject<HTMLDivElement> = useRef(null);
  const [activeId, setActiveId] = useState<any>(null);
  const [menus, setMenus] = useState<any>([]);
  const [activeMenuID, setActiveMenuID] = useState<string | null>(null);

  const hashPath = window.location.hash;
  if(hashPath.includes("?auth")){
    var path = hashPath.split("?auth");
  }else{
    var path = hashPath.split("?filterConfig");
  }
  const currentPath = path && path[0].replace('#/', '');

  useEffect(() => {
    var newMenus: any = [];
    menuItems && menuItems.map((item: any, index: number) => {
      var itemArr: any = [];
      item.submenus.map((obj: any, ind: number) => {
        itemArr.push({
          'icon': obj.icon,
          'key': obj.key,
          'label': obj.label,
          'submenus': obj.submenus,
          'value': `${item.label}-${obj.value+index+ind}`
        });
      })
      newMenus.push({
        'icon': item.icon,
        'key': item.key,
        'label': item.label,
        'submenus': itemArr,
        'value': `${item.label}-${item.value+index}`
      })
    });
    setMenus(newMenus);
    setActiveId(localStorage.getItem('currentKey')||null);
  }, [menuItems]);

  useEffect(() => {
    document.addEventListener('mousedown', onOutSideClick);
  }, []);

  useEffect(() => {
    document.addEventListener('onmouseout', onOutSideHover);
  }, []);

  useEffect(() => {
    document.addEventListener('onmouseleave', onOutSideHover);
  }, []);


  const getOrigin = () => {
    const address = location.origin + location.pathname + (location.pathname.endsWith('/') ? '' : '/')
    return address;
  }
  const onOutSideClick = (event: any): void => {
    const selectedElement = document.getElementsByClassName('drawer');
    if (selectedElement && selectedElement[0] && !selectedElement[0].contains(event.target)) {
      setShowSubMenu(false);
      setActiveId(null);
    }
  };

  const onOutSideHover = (event: any): void => {
    const selectedElement = document.getElementsByClassName('drawer');
    if (selectedElement && selectedElement[0] && !selectedElement[0].contains(event.target)) {
      setShowSubMenu(false);
      setActiveMenu();
      setActiveId(null);
    }
  };

  const collapseMainDrawer = (): void => {
    if (drawerRef && drawerRef.current) {
      const menu = document.querySelector('.drawer-menu');
      if (menu) menu.classList.add('collapse-drawer');
    }
  };

  const expandMainDrawer = (): void => {
    if ((drawerRef && drawerRef.current) || showMenuBar) {
      const menu = document.querySelector('.drawer-menu');
      if (menu) menu.classList.remove('collapse-drawer');
    }
  };

  const setActiveMenu = (): void => {
    setShowSubMenu(true);
    collapseMainDrawer();
  };

  const getActiveMenuInfo = (): IMenuItem => {
    return activeMenuInfo;
  };

  const setActiveSubMenu = (e: any, obj: any): void => {
    localStorage.setItem('currentKey',obj.value)
    setActiveMenuID(obj.value);
    onSubMenuClick && onSubMenuClick(obj.key);
    setShowSubMenu(false);
    e.preventDefault();
  };


  const setCurrentKeySelected = (key: string) => {
    if (key.endsWith(currentPath)) {
      if (currentPath !== currentKey) {
        return currentPath && isExactMatch(key, currentPath) ? 'submenu-active' : ''
      }
      return currentKey && isExactMatch(key, currentKey) ? 'submenu-active' : ''
    }
    if (createEditCheck(key)) {
      return 'submenu-active'
    }
    return ''
  }

  const createEditCheck = (key: string) => {
    return (key.includes(currentPath) || currentPath.includes(key)) && (currentPath.includes('edit') || currentPath.includes('create'))
  }

  const escapeRegExpMatch = function (s: any) {
    return s && s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };
  const isExactMatch = (str: any, match: any) => {
    return new RegExp(`\\b${escapeRegExpMatch(match)}\\b`).test(str)
  }

  const selectDefaultMenu = (obj: any) => {
    var cls = '';
    var tmp = obj && obj.submenus && obj.submenus.filter((item: any) => {
      var key;
      key = item && item.key && item.key.replace('-', '')
      if (item && item.key && item.key.endsWith(currentPath)) {
        if (currentPath) {
          if (isExactMatch(key, currentPath && currentPath.replace('-', ''))) {
            return item
          }
        } else if (currentKey) {
          if (isExactMatch(key, currentKey && currentKey.replace('-', ''))) {
            return item
          }
        }
      }
      if (createEditCheck(item.key)) {
        return item
      }
    });

    if (tmp && tmp.length > 0) {
      return `${cls} menu-selected`
    }
    return `${cls} `
  }

  const selectDefaultMenuByValue = (obj: any) => {
    var cls = '';
    var tmp = obj && obj.submenus && obj.submenus.filter((item: any) => {
      if (activeMenuID === item.value) {
        return item
      }
    });
    if (tmp && tmp.length > 0) {
      return `${cls} menu-selected`
    }
    return `${cls} `
  }


  const getActivemenu = (obj: string) => {
    var cls = '';
    if (activeId === obj) {
      return `${cls} menu-active`
    }
    return `${cls} `
  }

  const showSubMenus = (obj: any) => {
    setShowSubMenu(true);
    setActiveMenuInfo(obj);
  }

  return (
    <>
      <div className={`drawer ${customClass ? customClass : ''}`}>
        <div className={`drawer-menu ${subMenuAct === 'click' ? 'drawer-menu-hover' : ''}`} id='menubar' ref={drawerRef}>
          {menus.map((menuItem: IMenuItem) => (
            <div
              key={`menu-item-${menuItem.key}`}
              data-test-id={`menu-item-${menuItem.key}`}
              className={`drawer-menu-item  ${selectDefaultMenu(menuItem)} ${getActivemenu(menuItem.key)} ${selectDefaultMenuByValue(menuItem)} `}
              onMouseOver={() => {
                showSubMenus(menuItem);
                setActiveId(menuItem.key);
              }}
            >
              <div className={`drawer-menu-item-icon svg-${menuItem.icon}`}>
                <CustomIcons type={menuItem.icon} label={menuItem.label} />
              </div>
            </div>
          ))}
        </div>
        <CSSTransition
          in={!!(showSubMenu)}
          timeout={400}
          classNames='animate-submenu'
          unmountOnExit={true}
        >
          <div className='drawer-submenu' onMouseOver={expandMainDrawer}>
            <div
              data-test-id={getActiveMenuInfo() && getActiveMenuInfo().label}
              className='drawer-submenu-title'
            >
              {getActiveMenuInfo() && getActiveMenuInfo().label}
            </div>
            {getActiveMenuInfo() &&
              getActiveMenuInfo().submenus.map((subMenu: ISubMenuItem) => (
                <React.Fragment key={`label-${subMenu.key}`}>
                  <a
                    data-test-id={subMenu.label}
                    className={`drawer-submenu-item ${setCurrentKeySelected(subMenu.key)} ${activeMenuID === subMenu.value ? 'submenu-active':''}`}
                    onClick={(e: any) => setActiveSubMenu(e, subMenu)}
                    key={`label-${subMenu.key}`}
                    href={`${getOrigin()}#/${subMenu.key}`}
                  >
                    {subMenu.label}</a>
                </React.Fragment>
              ))}
          </div>
        </CSSTransition>
      </div>
    </>
  );
};
