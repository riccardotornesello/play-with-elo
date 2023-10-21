import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

export type ImageWithPlaceholderProps = ImageProps & {
  errorPlaceholder: string;
};

export default function ImageWithDefault(props: ImageWithPlaceholderProps) {
  const [src, setSrc] = useState(props.src);

  return (
    <Image
      {...props}
      src={src}
      onError={() => setSrc(props.errorPlaceholder)}
    />
  );
}
