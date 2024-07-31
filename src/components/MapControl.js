import { render, createPortal } from 'react-dom'
import { useEffect } from 'react'
const MapControl = ({ map, position, children }) => {
    let controlDiv = document.createElement('div')
    useEffect(() => {
        if (map && position) {
            //render({children})
            render(
                <div ref={el => map.controls[position].push(el)}>
                    {children}
                </div>,
                document.createElement("div")
            );
        }
        return () => {
            if (map && position) {
                //map.controls[position].clear();
            }
        };
    }, [map, position]);
    return createPortal(children, controlDiv)
    //return children
}
export default MapControl