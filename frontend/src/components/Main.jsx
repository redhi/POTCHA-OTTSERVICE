import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from "axios";
import Prediction, { Similar } from "./Prediction";
import Tab from "./Tab";
import MyResponsivePie from "./GraphComponent";
import {
  movieGenres,
  movieCountry,
  movieKeyword,
  tvGenres,
  tvCountry,
  tvKeyword,
} from "./GraphData";

const Main = ({
  popularList,
  predictableList,
  similarList,
  onPopular,
  onPredictable,
  onSimilar,
}) => {
  const [currTab, setCurrTab] = useState("MOVIE");
  // state를 redux로 관리하여 사용자 겸험을 상승
  //FIXME: just for demonstration(서버와 미연결로 인하여 현재 임시 데이터 api를 불러와서 렌더링 중)
  const requestContents = (subject) => {
    const hitContents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/${subject}/hit`
        );
        onPredictable(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    const similarContents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/${subject}/similar`
        );
        onSimilar(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    hitContents();
    similarContents();
  };

  const topRated = async () => {
    try {
      const response = await axios.get(
        "https://yts.mx/api/v2/list_movies.json?limit=10"
      );
      onPopular(response.data.data.movies);
    } catch (error) {
      console.log(error.response);
    }
  };
  const subject = currTab.toLowerCase();
  useEffect(() => {
    topRated();
  }, []);
  useEffect(() => {
    requestContents(subject);
  }, [currTab]);

  const handleClickTab = (tab) => {
    setCurrTab(tab);
  };
  console.log("currTab", currTab);
  // FIXME: 필요없는 부분은 배포전 재확인 후 삭제 예정
  const settings = {
    dots: true, // 슬라이드 밑에 점 보이게
    infinite: true, // 무한으로 반복
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000, // 넘어가는 속도
    slidesToShow: 5, // 4장씩 보이게
    // slidesToScroll: 5, // 1장씩 뒤로 넘어가게
    centerMode: true,
    centerPadding: "0px", // 0px 하면 슬라이드 끝쪽 이미지가 안잘림
  };
  const distribution = ["장르", "국가", "키워드"];
  return (
    <div>
      <div
        style={{
          backgroundImage: "linear-gradient(-45deg, #d754ab, #fd723a)",
          height: "650px",
        }}
      >
        <Header>인기 컨텐츠 Top 10</Header>
        {!popularList ? (
          <img
            src="https://blog.kakaocdn.net/dn/cmseNl/btrhhTwEA0r/TNAoELO6JmK3rhVeNfGYy0/img.gif"
            alt=""
          />
        ) : (
          <StyledSlider {...settings}>
            {popularList.map((content) => (
              <CardBox key={content.id}>
                <Link to={`/detail/${content.category}/${content.id}`}>
                  <CardImg alt="인기 컨텐츠" src={content.medium_cover_image} />
                  <CardText>{content.title}</CardText>
                </Link>
              </CardBox>
            ))}
          </StyledSlider>
        )}
      </div>
      <div
        style={{
          backgroundImage: "linear-gradient(45deg,#fd723a, #d754ab )",
          height: "100%",
        }}
      >
        <div>
          <Tab currTab={currTab} onClick={handleClickTab} />
          <h1>{`${currTab} 흥행 예측작품`}</h1>
          <div style={{ height: "400px", background: "white" }}>
            {currTab === "MOVIE" ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(33%, auto))",
                }}
              >
                {[movieGenres, movieCountry, movieKeyword].map((data, idx) => (
                  <div style={{ height: "300px" }}>
                    <div>{distribution[idx]}</div>
                    <MyResponsivePie data={data} key={idx} />
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                {[tvGenres, tvCountry, tvKeyword].map((data, idx) => (
                  <div style={{ height: "300px" }}>
                    <MyResponsivePie data={data} key={idx} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <Display>
            <Order>
              <h1>1</h1>
              <h1>2</h1>
              <h1>3</h1>
              <h1>4</h1>
              <h1>5</h1>
            </Order>
            <Detail>
              <h1>흥행 예측 작품</h1>
              {!predictableList ? (
                <img
                  src="https://blog.kakaocdn.net/dn/cmseNl/btrhhTwEA0r/TNAoELO6JmK3rhVeNfGYy0/img.gif"
                  alt=""
                />
              ) : (
                predictableList.map((prediction) => (
                  <Prediction key={prediction.id} prediction={prediction}>
                    <Link
                      to={`/detail/${prediction.category}/${prediction.id}`}
                    ></Link>
                  </Prediction>
                ))
              )}
            </Detail>

            <Details>
              <h1>흥행 예측 작품의 코로나 이전 유사 작품들 </h1>
              {/*FIXME: just for demonstration */}
              {[1, 2, 3, 4, 5].map((num) => (
                <SimilarDetail>
                  {!similarList ? (
                    <div></div>
                  ) : (
                    similarList.map((prediction) => (
                      <Similar key={prediction.id} prediction={prediction}>
                        <Link
                          to={`/detail/${prediction.category}/${prediction.id}`}
                        ></Link>
                      </Similar>
                    ))
                  )}
                </SimilarDetail>
              ))}
            </Details>
          </Display>
        </div>
      </div>
    </div>
  );
};

export default Main;

//TODO: styled-components 파일은 가급적 한 파일에서 관리
const Header = styled.h1`
  margin-left: 25px;
  position: absolute;
  top: 200px;
  font-size: 20px;
`;

const StyledSlider = styled(Slider)`
  .slick-list {
    max-width: 1600px;
    top: 200px;
    margin: 0 auto;
    height: 350px;
  }
  // 일단 아무런 효과 없는 것을 추정됨
  /* .slick-slide {
    height: auto; // ← that must not be ignored
  }
  .slick-track {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
  } */

  .slick-slide div {
    display: flex;
    justify-content: center;
  }

  .slick-dots {
    bottom: -220px;
  }
`;

const CardBox = styled.div`
  cursor: pointer;
  width: 200px;
`;

const CardImg = styled.img`
  width: 150px;
  height: 220px;
  text-align: center;
  margin: 0 auto;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;

  @media (max-width: 850px) {
    width: 100px;
    height: 150px;
  }
`;

const CardText = styled.p`
  margin: 0 auto;
  padding: 10px;
  font-size: 12px;
  font-weight: bolder;
  align-items: center;
  height: 70px;
  width: 150px;
  background: white;
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  @media (max-width: 850px) {
    font-size: 10px;
    width: 100px;
    height: 60px;
  }
`;

const Display = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const Order = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 30px 0;
  width: 100px;
  font-size: 40px;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 30px 0;
  width: 300px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 30px 0;
`;

const SimilarDetail = styled.div`
  display: flex;
`;
