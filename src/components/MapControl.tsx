import {createPortal} from 'react-dom';
import {createRoot} from 'react-dom/client';
import React, {useEffect} from 'react';

const container = document.getElementById('app');
const render = createRoot(container!);

interface MapControlProps {
  map: any;
  position: string;
  children: React.ReactNode;
}

const MapControl: React.FC<MapControlProps> = ({map, position, children}) => {
  let controlDiv: HTMLDivElement = document.createElement('div');
  useEffect(() => {
    if (map && position) {
      render.render(
        <div ref={el => map.controls[position].push(el)}>{children}</div>,
      );
      document.createElement('div');
    }
    return () => {
      if (map && position) {
        //map.controls[position].clear();
      }
    };
  }, [map, position]);
  return createPortal(children, controlDiv);
  //return children
};
export default MapControl;
