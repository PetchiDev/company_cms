import { useMotionValue, useSpring, useTransform } from 'framer-motion';

export const useMouseTilt = (settings = { max: 15, perspective: 1000 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [0.5, -0.5], [settings.max, -settings.max]), {
    stiffness: 150,
    damping: 20
  });
  
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [settings.max, -settings.max]), {
    stiffness: 150,
    damping: 20
  });

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPos = (mouseX / width) - 0.5;
    const yPos = (mouseY / height) - 0.5;

    x.set(xPos);
    y.set(yPos);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    rotateX,
    rotateY,
    onMouseMove,
    onMouseLeave,
    style: {
      perspective: settings.perspective,
      rotateX,
      rotateY
    }
  };
};
