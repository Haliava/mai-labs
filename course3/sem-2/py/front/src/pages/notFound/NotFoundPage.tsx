export const NotFoundPage = () => {
  const { pathname } = location;

  return (
    <div className="w-[50vw] h-[50vh] m-auto mt-[15vh]">
      <h1 className="m-auto text-[50px] animate-spin duration-1000 w-min">{pathname.split('/')[1]} не реализован в рамках MVP</h1>
    </div>
  )
}