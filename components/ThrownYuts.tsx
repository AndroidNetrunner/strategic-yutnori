export default function ThrownYuts({ myYut, opponentYut }) {
  let result;
  switch (myYut + opponentYut) {
    case 0:
      result = "모";
      break;
    case 1:
      result = "뒷도";
      break;
    case 2:
      result = "개";
      break;
    case 3:
      result = "걸";
      break;
    case 4:
      result = "윷";
  }
  return (
    <>
      <div>던져진 윷: {result}</div>
    </>
  );
}
