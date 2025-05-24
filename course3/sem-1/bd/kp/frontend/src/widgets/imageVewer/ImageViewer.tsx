import Viewer from "react-viewer";

import ViewerProps from "react-viewer/lib/ViewerProps";

type ImageViewerProps = Pick<ViewerProps, 'onClose' | 'visible'> & {
  className?: string;
  image: string;
}
 
export const ImageViewer = ({image, ...props}: ImageViewerProps) => {
  return (
    <Viewer noFooter {...props} images={[{src: image }]} />
  );
}
