

const MaxWidthWrapper = ({
    children,
    className
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
  return (
    <div className={`max-w-7xl max-sm:w-full ${className}`}>
      {children}
    </div>
  )
}

export default MaxWidthWrapper
