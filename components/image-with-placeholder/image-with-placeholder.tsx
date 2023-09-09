import { useState } from 'react';
import Image from 'next/image';

export default function ImageWithPlaceholder(props: any) {
  const [src, setSrc] = useState(props.src);

  return (
    <Image
      {...props}
      src={src}
      onError={() => setSrc('/pictures/question.png')}
    />
  );
}
