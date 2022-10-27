import Button from "./Button";

function startNewPiece() {
    
}

export default function MovingPieces({myTurn, color, remainedPieces}) {
    if (!myTurn)
        return <div>상대편이 말을 움직이고 있습니다.</div>;
    return <>
    <div>움직일 말을 선택해주세요.</div>
    <Button text="새 말 출발하기" type="text" className={color === "blue" ? "btn btn-primary" : "btn btn-danger"} ableCondition={remainedPieces} onClick={() => {startNewPiece();}} />
    </>;
}