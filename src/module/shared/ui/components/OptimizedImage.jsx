import Image from "next/image";

const LOCAL_RASTER_EXTENSIONS = /\.(avif|webp|png|jpe?g)$/i;

const isOptimizableLocalImage = (src) =>
  typeof src === "string" && src.startsWith("/") && LOCAL_RASTER_EXTENSIONS.test(src);

const OptimizedImage = ({
  src,
  alt = "",
  width = 64,
  height = 64,
  fill = false,
  sizes,
  quality = 75,
  priority = false,
  loading = "lazy",
  ...props
}) => {
  if (!src) return null;

  if (!isOptimizableLocalImage(src)) {
    return <img src={src} alt={alt} loading={priority ? "eager" : loading} {...props} />;
  }

  const imageProps = {
    src,
    alt,
    quality,
    priority,
    sizes: sizes || (fill ? "100vw" : undefined),
    loading: priority ? undefined : loading,
    ...props,
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return <Image {...imageProps} width={width} height={height} />;
};

export default OptimizedImage;
