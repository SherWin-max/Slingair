import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import tombstone from "../assets/tombstone.png";

const Reservation = ({ reservationId }) => {
    const navigate = useNavigate();
    const [resData, setResData] = useState(null);

    useEffect(() => {

        fetch(`/api/get-reservation/${reservationId}`)
            .then(res => res.json())
            .then(data => {

                if (data.status === 400 || data.status === 500) {
                    throw new Error(data.message);
                } else {
                    console.log("fetched res data", data.data);
                    setResData(data.data);
                }
            })
            .catch((error) => {
            })
    }, [reservationId]);
    return (

        <Wrapper>
            {!resData? (<h1>Loodaing..</h1>) : 
           ( <div>
            <h1>flight is Confirmed!!!</h1>
            <Info>
                <p><span>Reservation #:</span>{reservationId}</p>
                <p><span>Flight:</span> {resData.flight}</p>
                <p><span>Seat #:</span> {resData.seat}</p>
                <p><span>Name:</span> {resData.firstName} {resData.lastName}</p>
                <p><span>Email:</span> {resData.email}</p>
               
            </Info>
          </div> )}
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
    padding: 20px 0px;
    width: 520px;
    font-weight: 600;
    border: 3px solid var(--color-alabama-crimson);
    margin: 40px;
    font-family: var(--font-body);
    background-color: white;
    text-align: center;
}
span{
    padding: 8px;
    
}
`;
const Img = styled.img`
width: 200px;
    height: auto;
`;

export default Reservation;
