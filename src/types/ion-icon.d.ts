// Augment JSX to allow ion-icon web component without TypeScript errors
declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        slot?: string;
        size?: string;
      };
    }
  }
}
