export default function PageError({ message = "Something went wrong." }) {
  return (
    <div className="container py-5">
      <p className="text-danger mb-0">{message}</p>
    </div>
  );
}