import generateAvatar from '@/lib/github-avatar';
import { useRef, useEffect } from 'react';

type AvatarProps = {
  blocks?: number;
  size?: number;
}

const Avatar = ({ blocks = 6, size = 100 }: AvatarProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const avatar = generateAvatar({
      blocks,
      width: size
    });
    if (svgRef.current && avatar.svgElement) {
      svgRef.current.innerHTML = avatar.svgElement.outerHTML;
    }
  }, [blocks, size]);

  return <svg ref={svgRef} className='rounded-full' width={size} height={size} />;
};

export default Avatar;
