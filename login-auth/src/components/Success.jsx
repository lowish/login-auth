export default function Success({ name }) {
  const display = name && name.trim().length > 0 ? name : "User"

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-white sans-serif">
        {`Login Successful, ${display}!`}
      </h1>
    </div>
  )
}
