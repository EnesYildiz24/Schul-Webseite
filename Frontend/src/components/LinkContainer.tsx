/**
 * File copied (and only slightly modified) from
 * https://github.com/foxCaves/foxCaves/blob/main/frontend/src/components/link_container.tsx
 * License: AGPL
 * cf.
 * - https://github.com/react-bootstrap/react-router-bootstrap/issues/322
 * - https://github.com/foxCaves/foxCaves/pull/1422
 * 
 */
import React, { AllHTMLAttributes } from 'react';
import { useHref, useMatch, useNavigate } from 'react-router';

const isModifiedEvent = (event: React.MouseEvent<HTMLAnchorElement>) =>
    !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

interface LinkContainerInterface {
    readonly children: React.ReactElement;
    readonly to: string;
}

const ACTIVE_CLASS_NAME = 'active';

/*
 * Basically a rewritten and slimmed down version of react-router-bootstrap's LinkContainer
 * See: https://github.com/react-bootstrap/react-router-bootstrap/blob/master/src/LinkContainer.js
 */
export const LinkContainer: React.FC<LinkContainerInterface> = ({ children, to }) => {
    const navigate = useNavigate();
    const href = useHref({ pathname: to });
    const isActive = useMatch(to);

    const child = React.Children.only(children);
    if (!React.isValidElement<AllHTMLAttributes<HTMLAnchorElement>>(child)) {
        throw new Error('LinkContainer only accepts children containing HTMLAnchorElement');
    }

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (child.props.onClick) {
            child.props.onClick(event);
        }

        if (!event.defaultPrevented && event.button === 0 && !isModifiedEvent(event)) {
            event.preventDefault();

            navigate(to); // ?.catch(logError);
        }
    };

    return React.cloneElement(child, {
        className: [child.props.className, isActive ? ACTIVE_CLASS_NAME : null].join(' ').trim(),
        href,
        onClick: handleClick,
    });
};
