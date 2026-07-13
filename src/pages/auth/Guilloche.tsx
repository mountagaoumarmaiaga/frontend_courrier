/**
 * Motif guilloché (rosette gravée) — le langage visuel des documents
 * officiels. Rendu très discret, purement décoratif, sur le volet marine.
 */
export function Guilloche() {
  const layerA = Array.from({ length: 60 }, (_, i) => i * 6);
  const layerB = Array.from({ length: 60 }, (_, i) => i * 6 + 3);
  return (
    <svg
      viewBox="0 0 400 400"
      className="pointer-events-none absolute -bottom-24 -right-24 h-[560px] w-[560px] text-white opacity-[0.055]"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      aria-hidden="true"
    >
      {layerA.map((deg) => (
        <ellipse key={`a${deg}`} cx="200" cy="200" rx="188" ry="66" transform={`rotate(${deg} 200 200)`} />
      ))}
      {layerB.map((deg) => (
        <ellipse key={`b${deg}`} cx="200" cy="200" rx="120" ry="44" transform={`rotate(${deg} 200 200)`} />
      ))}
      <circle cx="200" cy="200" r="188" />
      <circle cx="200" cy="200" r="120" />
      <circle cx="200" cy="200" r="60" />
    </svg>
  );
}
