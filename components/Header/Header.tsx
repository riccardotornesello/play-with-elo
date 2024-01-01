'use client';

import cx from 'clsx';
import { useState } from 'react';
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
  Image,
  Drawer,
  ScrollArea,
  Flex,
  Anchor,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconChevronDown } from '@tabler/icons-react';
import classes from './Header.module.css';
import Logo from '@/assets/pictures/logo.png';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Tab = {
  label: string;
  href: string;
};

const tabs: Tab[] = [];

const user = {
  name: 'User',
  image: '',
};

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <header className={classes.header}>
        <Container className={classes.mainSection}>
          <Group justify="space-between">
            <Flex>
              {tabs.length > 0 && (
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              )}
              <Anchor component={Link} href="/dashboard">
                <Image src={Logo.src} alt="Play with ELO" w={28} />
              </Anchor>
            </Flex>

            <HeaderTabs />

            <HeaderUserMenu />
          </Group>
        </Container>
      </header>

      <HeaderDrawer opened={opened} toggle={toggle} />
    </>
  );
}

function HeaderUserMenu() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
          <Group gap={7}>
            <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
            <Text fw={500} size="sm" lh={1} mr={3}>
              {user.name}
            </Text>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Settings</Menu.Label>
        <Menu.Item
          leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          component={Link}
          href="/auth/signout"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function HeaderTabs() {
  const pathname = usePathname();

  if (tabs.length === 0) {
    return null;
  }

  return (
    <Tabs
      defaultValue="Home"
      variant="outline"
      visibleFrom="sm"
      value={pathname}
      classNames={{
        root: classes.tabs,
        list: classes.tabsList,
        tab: classes.tab,
      }}
    >
      <Tabs.List>
        {tabs.map((tab, i) => (
          <Tabs.Tab component={Link} href={tab['href']} value={tab['href']} key={i}>
            {tab['label']}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}

interface HeaderDrawerProps {
  opened: boolean;
  toggle: () => void;
}

function HeaderDrawer({ opened, toggle }: HeaderDrawerProps) {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <Drawer
      opened={opened}
      onClose={toggle}
      size="100%"
      padding="md"
      title="Navigation"
      hiddenFrom="sm"
      zIndex={1000000}
    >
      <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
        {tabs.map((tab, i) => (
          <Anchor key={i} component={Link} href={tab['href']} className={classes.drawerLink}>
            {tab['label']}
          </Anchor>
        ))}
      </ScrollArea>
    </Drawer>
  );
}
