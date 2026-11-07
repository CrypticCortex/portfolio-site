// The small specimen label each section carries: number, technique, and what it is applied to.
export default function Plate({ n, technique, note }) {
  return (
    <p className="plate-tag">
      <span>PL.{n}</span>
      <span className="plate-tag__tech">{technique}</span>
      {note && <span className="plate-tag__note">{note}</span>}
    </p>
  );
}
