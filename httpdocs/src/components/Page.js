import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { Helmet } from "react-helmet";
import gql from 'graphql-tag';

/**
 * GraphQL page query that takes a page slug as a uri
 * Returns the title and content of the page
 */
const PAGE_QUERY = gql`
  query PageQuery($uri: String!) {
    pageBy(uri: $uri) {
      pageId
      title
      content
      seo {
        title
        metaDesc
      }
    }
  }
`;

/**
 * Fetch and display a Page
 */
class Page extends Component {
  state = {
    page: {
      title: '',
      content: '',
      seo: {
        title: '',
        metaDesc: ''
      }
    },
  };

  componentDidMount() {
    this.executePageQuery();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      this.executePageQuery();
    }
  }

  /**
   * Execute page query, process the response and set the state
   */
  executePageQuery = async () => {
    const { match, client } = this.props;

    let uri = match.params.slug;
    if (!uri) {
      uri = '404';
    }

    const result = await client.query({
      query: PAGE_QUERY,
      variables: { uri },
    });

    const page = result.data.pageBy;
    this.setState({ page });
  };

  render() {
    const { page } = this.state;

    if ( null !== page ) {
      return (
        <>
          <Helmet>
            <title>{page.seo.title}</title>
            <meta name="description" content={page.seo.metaDesc}/>
          </Helmet>
          <div className={`content mh4 mv4 w-two-thirds-l center-l post-${page.pageId}`}>
            <h1 className="tc mv5 f1">{page.title}</h1>

            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: page.content,
              }}
            />
          </div>
        </>
      );
    } else {
      return (
        <div className={`content mh4 mv4 w-two-thirds-l center-l is-404`}>
          <h1 className="tc mv5 f1">404!</h1>
        </div>
      );
    }
  }
}

export default withApollo(Page);
