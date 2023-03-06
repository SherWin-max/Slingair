import styled from "styled-components";
import { useState, useEffect } from "react";
import tombstone from "../assets/tombstone.png";

const Confirmation = ({ reservationId }) => {
    const [confirmData, setConfirmData] = useState(null)
    useEffect(() => {
        fetch(`/api/get-reservation/${reservationId}`)
            .then(res => res.json())
            .then((data) => {
                setConfirmData(data.data)


            }, [reservationId])
    })
    return (
        <Wrapper>
            {!confirmData ? (<h1>Loodaing..</h1>) :
                (<Div>
                    <h4>Flight is Confirmed!!!</h4>
                    <Info>
                        <p><span>Reservation #:</span>{reservationId}</p>
                        <p><span>Flight:</span> {confirmData.flight}</p>
                        <p><span>Seat #:</span> {confirmData.seat}</p>
                        <p><span>Name:</span> {confirmData.firstName} {confirmData.lastName}</p>
                        <p><span>Email:</span> {confirmData.email}</p>
                    </Info>
                </Div>)}
            <Img src={tombstone}></Img>
        </Wrapper>


    )
};

const Wrapper = styled.div`
display: flex;
height: 100vh;
flex-direction:column;
align-items:center;
`;
const Info = styled.div`
p{
    padding: 5px;
}
span{
    padding: 5px;
    
}
`;
const Div = styled.div`
    padding: 20px 0px;
    width: 520px;
    font-weight: 600;
    border: 3px solid var(--color-alabama-crimson);
    margin: 40px;
    font-family: var(--font-body);
    background-color: white;
    text-align: center;
    `
const Img = styled.img`
width: 200px;
    height: auto;
  
`


export default Confirmation;
