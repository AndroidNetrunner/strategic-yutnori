function calculateYut(yut) {
  switch (yut) {
    case 0:
      return "모";
    case 1:
      return "도";
    case 2:
      return "개";
    case 3:
      return "걸";
    default:
      return "윷";
  }
}

export default function ThrownYuts({ thrownYuts }) {
  console.log("thrownYuts in Compoennt", thrownYuts);
  const result = thrownYuts.map((yut) => calculateYut(yut));
  console.log("result: ", result);
  return (
    <>
      <div>던져진 윷: {result.join(" ")}</div>
    </>
  );
}
