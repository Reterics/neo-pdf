import {render, fireEvent, screen} from '@testing-library/react'
import ContainerComponent from "./ContainerComponent";


describe('ContainerComponent', () => {
    it('renders ContainerComponent crashing', () => {
        render(<ContainerComponent />);
        screen.debug();
    })
})
