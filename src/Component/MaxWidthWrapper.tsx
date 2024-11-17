

const MaxWidthWrapper = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
  return (
    <div className="max-w-7xl max-sm:w-full">
      {children}
    </div>
  )
}

export default MaxWidthWrapper
