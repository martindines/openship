import Link from 'next/link';
import { withRouter } from 'next/router';
import {
  Menu,
  Icon,
  Heading,
  Pane,
  TextInputField,
  Popover,
  IconButton,
} from 'evergreen-ui';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import Button from '../common/Button';
import { shopsQuery, shopsQueryVars } from '../shops/ShopList';
import Signout from '../user/Signout';
import { front, prodFront } from '../../config';

const Divider = (
  <Pane
    flexShrink={0}
    height={3}
    backgroundColor="rgb(44, 71, 118)"
    borderRadius={1}
    marginY={5}
    marginX={12}
  />
);

export const NavGroupTitle = ({ title, icon }) => (
  <Pane display="flex" alignItems="center">
    <Heading
      size={100}
      marginTop={8}
      marginBottom={8}
      marginLeft={16}
      marginRight={16}
      fontWeight={700}
      fontSize="13px"
      color="#d7dae0"
      flex={1}
    >
      {title}
    </Heading>
    {icon}
  </Pane>
);

function postRequest(url, data) {
  return fetch(url, {
    credentials: 'same-origin', // 'include', default: 'omit'
    method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
    body: JSON.stringify({ shops: data }), // Use correct payload (matching 'Content-Type')
    headers: { 'Content-Type': 'application/json' },
  });
}

const Header = ({ router, logo, onClick }) => {
  const { asPath } = router;

  const NavItem = ({ icon, iconColor, title, href }) => (
    <Pane
      borderLeft={`3px solid ${
        asPath && asPath.startsWith(href) ? 'rgb(66, 95, 146)' : 'transparent'
      }`}
      background={asPath && asPath.startsWith(href) ? 'rgb(35, 61, 106)' : null}
      onSelect={onClick}
    >
      <Link href={href}>
        <Menu.Item
          icon={
            <Icon
              icon={icon}
              color={iconColor || '#ffffff'}
              marginRight="-8px"
              marginLeft="13px"
              size={15}
            />
          }
          onSelect={onClick}
          width="100%"
        >
          <Heading
            color="#fff"
            size={500}
            fontSize={15}
            overflow="visible"
            textTransform="capitalize"
          >
            {title}
          </Heading>
        </Menu.Item>
      </Link>
    </Pane>
  );

  return (
    <Pane
      background="rgb(23, 43, 77)"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Pane>
        <Menu width="100%">
          {logo}
          <Menu.Group>
            <NavGroupTitle title="Orders" />
            <NavItem icon="delta" title="Pending" href="/pending" />
            <NavItem icon="time" title="Processed" href="/processed" />
            <NavItem icon="tick-circle" title="Completed" href="/completed" />
          </Menu.Group>
          {Divider}
          <Menu.Group>
            <NavGroupTitle title="Products" />
            <NavItem icon="database" title="All Products" href="/products" />
            <NavItem icon="globe" title="Marketplace" href="/find" />
          </Menu.Group>
          {Divider}
          <Menu.Group>
            <NavGroupTitle
              title={
                <Link href="/shops">
                  <Pane color="#d7dae0" cursor="pointer">
                    Shops
                  </Pane>
                </Link>
              }
              icon={
                <Popover
                  content={
                    <Pane
                      width={300}
                      display="flex"
                      alignItems="left"
                      justifyContent="center"
                      flexDirection="column"
                      padding={15}
                    >
                      <form
                        method="GET"
                        action="/shopify/auth"
                        style={{ width: '100%' }}
                      >
                        <TextInputField label="Shop Name" marginBottom="10px" />
                        <TextInputField
                          label="Shop URL"
                          marginBottom="10px"
                          hint="Must end in .myshopify.com"
                          id="shop"
                          name="shop"
                        />

                        <Button
                          width="100%"
                          justifyContent="center"
                          appearance="primary"
                          intent="success"
                          fontSize="12px"
                          paddingY={3}
                        >
                          Go to Shopify
                        </Button>
                      </form>
                    </Pane>
                  }
                >
                  <IconButton
                    height={20}
                    icon="plus"
                    marginRight={16}
                    appearance="primary"
                    intent="success"
                    borderRadius={20}
                    outline="none"
                  />
                </Popover>
              }
            />
            <Query query={shopsQuery} variables={shopsQueryVars}>
              {({ data, error, loading }) => {
                if (error || !data.shops) return null;
                const { shops } = data;
                postRequest(
                  `${
                    process.env.NODE_ENV === 'development' ? front : prodFront
                  }/_shopify`,
                  shops
                );

                return shops.map((shop, index) => (
                  <Pane key={index}>
                    <NavItem
                      icon={
                        <Pane
                          marginRight="-8px"
                          marginLeft="13px"
                          alignItems="center"
                          justifyContent="center"
                          display="flex"
                        >
                          <svg
                            version="1.1"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            width="16px"
                            height="16px"
                            viewBox="0 0 48 48"
                            enableBackground="new 0 0 16 16"
                            xmlSpace="preserve"
                            fill="#47B881"
                          >
                            <path d="M24 0C10.746 0 0 10.746 0 24s10.746 24 24 24 24-10.746 24-24S37.254 0 24 0zm0 36c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12-5.373 12-12 12z" />
                          </svg>
                        </Pane>
                      }
                      iconColor="success"
                      title={shop.name}
                      href={`/shop?shop=${shop.domain.split('.')[0]}`}
                    />
                  </Pane>
                ));
              }}
            </Query>
          </Menu.Group>
          {Divider}
          <Menu.Group>
            {/* <NavGroupTitle title="Settings" /> */}
            <NavItem icon="cog" title="Settings" href="/settings" />
          </Menu.Group>
        </Menu>
      </Pane>
      <Pane marginTop="auto">
        <Signout />
      </Pane>
    </Pane>
  );
};

export default withRouter(Header);
