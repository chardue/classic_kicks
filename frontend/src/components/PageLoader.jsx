export default function PageLoader({ text = "Loading..." }) {
  return (
    <div className="container py-5">
      <p className="mb-0">{text}</p>
    </div>
  );
}