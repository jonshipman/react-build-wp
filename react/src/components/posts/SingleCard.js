import React from "react";
import { gql, useQuery } from "@apollo/client";

import PostContent from "../elements/PostContent";
import Image from "../elements/Image";
import Loading from "../elements/Loading";
import LoadingError from "../elements/LoadingError";

const QUERY = gql`
  query CardSingleQuery {
    posts(last: 1, where: { hasPassword: false }) {
      edges {
        node {
          id
          title
          excerpt
          databaseId
        }
      }
    }
  }
`;

const OnQueryFinished = ({ cards, heading, subheading }) => (
  <div className="cards-single w-100 h-100 bg-green pa4 white tc flex-l items-center-l">
    <div className="w-100-l">
      <div className="cards--inner relative z-1">
        <h3>
          <span className="fw4 f2 white">{heading}</span>
        </h3>
        <h4>
          <span className="fw3 f5 white">{subheading}</span>
        </h4>
        {cards &&
          cards.map((card) => (
            <div className="card mw6 center white-70 ma4 i" key={card.node.id}>
              <PostContent className="card--text" content={card.node.excerpt} />
              <div className="f5 tr mb4">{card.node.title}</div>
            </div>
          ))}
      </div>

      <div className="absolute absolute--fill o-10 overflow-hidden">
        <Image width={1200} height={800} className="h-100 mw-none grow" />
      </div>
    </div>
  </div>
);

export default (props) => {
  const { loading, error, data } = useQuery(QUERY);

  if (loading) return <Loading />;
  if (error) return <LoadingError error={error.message} />;

  return <OnQueryFinished cards={data?.posts?.edges} {...props} />;
};
