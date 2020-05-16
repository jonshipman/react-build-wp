import React from 'react';
import { gql, useQuery } from '@apollo/client';

import PostContent from '../elements/PostContent';
import Image from '../elements/Image';
import Loading from '../elements/Loading';
import LoadingError from '../elements/LoadingError';

const TESTIMONIAL_QUERY = gql`
  query TestimonialQuery {
    posts(last: 1) {
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

const OnQueryFinished = ({ testimonials }) => (
  <div className="testimonials w-100 h-100 bg-green pa4 white tc flex-l items-center-l">
    <div className="w-100-l">
      <div className="testimonials--inner relative z-1">
        <h3><span className="fw4 f2 white">Coverage That Meets <span className="fw7">Your</span> Needs</span></h3>
        <h4><span className="fw3 f5 white">We Provide The Best Service Hands Down.</span></h4>
        {testimonials && testimonials.map(testimonial => (
          <div className="testimonial mw6 center white-70 ma4 i" key={testimonial.node.id}>
            <PostContent className="testimonial--text" content={testimonial.node.excerpt} />
            <div className="f5 tr mb4">{testimonial.node.title}</div>
          </div>
        ))}
      </div>

      <div className="absolute absolute--fill o-10 overflow-hidden">
        <Image
          src="https://www.fillmurray.com/1200/800"
          className="h-100 mw-none grow"
        />
      </div>
    </div>
  </div>
);

export default () => {
  const { loading, error, data } = useQuery(TESTIMONIAL_QUERY);

  if (loading) return <Loading />;
  if (error) return <LoadingError error={error.message} />;

  return <OnQueryFinished testimonials={data.posts.edges} />
}
