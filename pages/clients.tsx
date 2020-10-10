import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { getOrders } from '@self/lib/services/getOrders';
import { Themed, ThemedCSS } from '@self/lib/types';
import { format } from 'date-fns';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { Fragment, SVGProps } from 'react';
import { Grid, PhoneCall, PhoneMissed, PhoneOff, Search } from 'react-feather';
import { useQuery } from 'react-query';
import tw from 'twin.macro';

interface Props {
  initialData: any;
}

let ClientsPage: NextPage<Props> = (props) => {
  let { initialData } = props;
  let { status, data } = useQuery('ordersData', getOrders, { initialData: initialData });

  return (
    <>
      <Head>
        <title>Clients | Dashboard</title>
      </Head>

      <div
        css={css`
          ${tw`p-4`}
        `}
      >
        <div
          css={
            ((theme) => css`
              ${tw`flex rounded shadow my-4`}
              min-height: 48px;
              background: ${theme.colors.bgItem};
              color: ${theme.colors.textItem};

              > * {
                border-right: 1px solid ${theme.colors.bgContent};

                &:last-child {
                  border: 0;
                }
              }
            `) as ThemedCSS
          }
        >
          <ToolbarItem>
            <label
              htmlFor="search-orders"
              css={css`
                align-self: center;
              `}
            >
              Search
            </label>
          </ToolbarItem>
          <ToolbarItem
            noPadding
            css={css`
              ${tw`flex-1`}
            `}
          >
            <input
              id="search-orders"
              type="search"
              placeholder="Search..."
              css={
                ((theme) => css`
                  ${tw`flex-1 px-4`}
                  background: ${theme.colors.bgItem};
                  color: ${theme.colors.textItem};

                  ::placeholder {
                    color: ${theme.colors.textContent};
                  }
                `) as ThemedCSS
              }
            ></input>
          </ToolbarItem>
          <ToolbarItem noPadding>
            <button
              css={css`
                ${tw`px-4`}
              `}
            >
              <Search strokeWidth="1.5"></Search>
            </button>
          </ToolbarItem>
          <ToolbarItem noPadding>
            <button
              css={css`
                ${tw`px-4 pr-2`}
              `}
            >
              <StackIcon strokeWidth="1.5"></StackIcon>
            </button>
            <button
              css={css`
                ${tw`px-4 pl-2`}
              `}
            >
              <Grid strokeWidth="1.5"></Grid>
            </button>
          </ToolbarItem>
        </div>
        <table
          css={(theme) =>
            css`
              ${tw`w-full`}
              color: ${theme.colors.textTableHeader};
            `
          }
        >
          <thead
            css={css`
              ${tw`text-left`}
            `}
          >
            <tr css={css``}>
              <th>Status</th>
              <th>Phone Number</th>
              <th>Date</th>
              <th>Curator</th>
              <th>Duration</th>
              <th colSpan={2}>Recording</th>
            </tr>
          </thead>
          <tbody>
            {status === 'success' &&
              data.map((item, i) => (
                <Fragment key={item.id}>
                  <Row>
                    <Cell
                      title={item.status}
                      css={css`
                        text-align: center;
                        vertical-align: middle;
                      `}
                    >
                      {item.status === 'completed' && <SuccessIcon as={PhoneCall}></SuccessIcon>}
                      {item.status === 'no-response' && <ErrorIcon as={PhoneMissed}></ErrorIcon>}
                      {item.status === 'busy' && <ErrorIcon as={PhoneOff}></ErrorIcon>}
                    </Cell>
                    <Cell>{item.phoneNumber}</Cell>
                    <Cell>{format(new Date(item.callDate), 'dd.MM.yyyy hh:mm:ss')}</Cell>
                    <Cell>{item.curator}</Cell>
                    <Cell>{item.duration ? ~~(item.duration / 60) : 'N/A'}</Cell>
                    <Cell>
                      <PlayIcon></PlayIcon>
                    </Cell>
                    <Cell>
                      {item.status === 'completed' && <Button>Add</Button>}
                      {item.status === 'no-response' && <Button>Call Back</Button>}
                      {item.status === 'busy' && <Button>Call Back</Button>}
                    </Cell>
                  </Row>
                  <Spacer key={i}></Spacer>
                </Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

let ToolbarItem = styled.div<{ noPadding?: boolean }>`
  ${tw`flex`}
  ${({ noPadding }) => !noPadding && tw`px-4 space-x-2`}
`;

let PlayIcon: React.FC = () => {
  return (
    <svg viewBox="0 0 10 10" width="24">
      <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth=".5"></circle>
      <polyline
        points="0 0 0 10 8 5 0 0"
        fill="currentColor"
        css={css`
          transform-origin: center;
          transform: scale(0.35) translateX(2px);
        `}
      ></polyline>
    </svg>
  );
};

let StackIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 24 24" width="24" strokeWidth="2" {...props}>
      <rect width="18.5" x="2.5" height="6" y="4" stroke="currentColor" fill="none"></rect>
      <rect width="18.5" x="2.5" height="6" y="15" stroke="currentColor" fill="none"></rect>
    </svg>
  );
};

let SuccessIcon = styled.div<Themed>`
  ${tw`inline-block`}
  color: ${({ theme }) => theme.colors.success};
  stroke-width: 1;
`;

let ErrorIcon = styled.div<Themed>`
  ${tw`inline-block`}
  color: ${({ theme }) => theme.colors.error};
  stroke-width: 1;
`;

let Row = styled.tr<Themed>`
  ${tw`rounded shadow`}
  background: ${({ theme }) => theme.colors.bgItem};
  color: ${({ theme }) => theme.colors.textItem};
`;

let Cell = styled.td`
  ${tw`py-4 px-0`}
`;

let Button = styled.button<Themed>`
  ${tw`py-1 px-2 rounded`}
  border: 1px solid ${(props) => props.theme.colors.textTableHeader};
`;

let Spacer = styled.tr`
  ${tw`h-4`}
`;

export let getServerSideProps: GetServerSideProps<Props> = async () => {
  let data = await getOrders();
  return { props: { initialData: data } };
};

export default ClientsPage;
