/* eslint-disable */
import * as React from 'react';
import * as CSS from 'csstype';
import styled, { css } from '@xstyled/styled-components';
import { th } from '@xstyled/system';
import Draggable from 'react-draggable';
import { Button, List, ModalContext, TitleBar } from '@react95/core';

type WrapperProps = {
  width?: CSS.Property.Width;
  height?: CSS.Property.Height;
  active?: boolean;
};

const ModalWrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  position: fixed;
  padding: 2 2 8;
  top: 50px;
  background-color: material;
  box-shadow: inset 1px 1px 0px 1px ${th('colors.borderLightest')},
    inset 0 0 0 1px ${th('colors.borderDark')},
    1px 1px 0 1px ${th('colors.borderDarkest')};
  ${({ width, height }) => `
    width: ${width ? `${width}px` : 'auto'};
    height: ${height ? `${height}px` : 'auto'};
  `}
  ${({ active }) =>
    active
      ? css`
          z-index: modal;
        `
      : ''}
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 6;
`;

type ButtonWrapperProps = {
  buttonsAlignment?: CSS.Property.JustifyContent;
};

const ButtonWrapper = styled.div<ButtonWrapperProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ buttonsAlignment = 'center' }) => buttonsAlignment};
  padding: 0 6 6 6;
  & ${Button} {
    margin-right: 6;
    min-width: 70px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const MenuWrapper = styled.ul`
  display: flex;
  flex-direction: row;
  list-style: none;
  margin: 0;
  padding-left: 0;
  padding-bottom: 3;
  border-bottom-style: solid;
  border-width: 1;
  border-bottom-color: borderDark;
  box-shadow: 0 1px 0 0 ${th('colors.borderLighter')};
`;

const MenuItem = styled.li<Pick<WrapperProps, 'active'>>`
  position: relative;
  padding-left: 6;
  padding-right: 6;
  user-select: none;
  ul {
    position: absolute;
    left: 0;
    color: ${th('colors.materialText')};
  }
  ${({ active }) =>
    active &&
    css`
      background-color: primary;
      color: ${th('colors.materialTextInvert')};
    `};
`;

MenuItem.displayName = 'MenuItem';

export type ModalButtons = {
  value: string;
  onClick(event: React.MouseEvent): void;
};

export type ModalMenu = {
  name: string;
  list: React.ReactElement<typeof List>;
};

export type ModalDefaultPosition = {
  x: number;
  y: number;
};
export type ModalPositionOffset = {
  x: number | string;
  y: number | string;
};

export type ModalProps = {
  icon?: React.ReactElement;
  closeModal(event: React.MouseEvent): void;
  title: string;
  buttons?: Array<ModalButtons>;
  menu?: Array<ModalMenu>;
  defaultPosition?: ModalDefaultPosition;
  positionOffset?: ModalPositionOffset;
  hasWindowButton?: boolean;
} & Omit<WrapperProps, 'active'> &
  ButtonWrapperProps &
  React.HTMLAttributes<HTMLDivElement>;

const ModalRenderer = (
  {
    hasWindowButton: hasButton = true,
    buttons,
    buttonsAlignment,
    children,
    closeModal,
    defaultPosition,
    positionOffset,
    height,
    icon,
    menu,
    title,
    width,
    ...rest
  }: ModalProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    addWindows,
    removeWindow,
    updateWindow,
    setActiveWindow,
    activeWindow,
  } = React.useContext(ModalContext);
  const [id, setId] = React.useState<string | null>(null);
  const [menuOpened, setMenuOpened] = React.useState('');
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (!id) {
      const newId = addWindows({ icon, title, hasButton });
      if (newId) {
        setId(newId);
        setActiveWindow(newId);
      }
    } else {
      updateWindow(id, { icon, title, hasButton });
    }
  }, [id, icon, title, hasButton]);
  React.useEffect(() => {
    return () => {
      if (id) {
        removeWindow(id);
      }
    };
  }, [id]);
  React.useEffect(() => setIsActive(id === activeWindow), [id, activeWindow]);

  return (
    <Draggable
      handle=".draggable"
      defaultPosition={defaultPosition}
      positionOffset={positionOffset}
      onMouseDown={id ? () => setActiveWindow(id) : undefined}
    >
      <ModalWrapper
        width={width}
        height={height}
        {...rest}
        active={isActive}
        ref={ref}
      >
        <TitleBar
          active={isActive}
          icon={icon}
          title={title}
          className="draggable"
        >
          <TitleBar.OptionsBox>
            <TitleBar.Option>?</TitleBar.Option>
            <TitleBar.Option onClick={closeModal}>X</TitleBar.Option>
          </TitleBar.OptionsBox>
        </TitleBar>

        {menu && menu.length > 0 && (
          <MenuWrapper>
            {menu.map(({ name, list }) => {
              const active = menuOpened === name;
              return (
                <MenuItem
                  key={name}
                  onMouseDown={() => setMenuOpened(name)}
                  active={active}
                >
                  {name}
                  {active && list}
                </MenuItem>
              );
            })}
          </MenuWrapper>
        )}

        <Content onClick={() => setMenuOpened('')}>{children}</Content>
        {buttons && buttons.length > 0 && (
          <ButtonWrapper buttonsAlignment={buttonsAlignment}>
            {buttons.map(button => (
              <Button
                key={button.value}
                onClick={button.onClick}
                value={button.value}
              >
                {button.value}
              </Button>
            ))}
          </ButtonWrapper>
        )}
      </ModalWrapper>
    </Draggable>
  );
};

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(ModalRenderer);

Modal.displayName = 'Modal';

Modal.defaultProps = {
  icon: undefined,
  title: 'Modal',
  buttonsAlignment: 'flex-end',
  children: null,
  defaultPosition: { x: 0, y: 0 },
  buttons: [],
  menu: [],
  width: undefined,
  height: undefined,
  closeModal: () => {},
};
export default Modal;