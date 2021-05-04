export default {
  items: [
    {
      title: true,
      name: 'Administrator',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Locations',
      url: '/buttons',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Location List',
          url: '/taglist',
          icon: 'icon-cursor',
        },
        {
          name: 'Add Location',
          url: '/addtag',
          icon: 'icon-cursor',
        },
        
      ],
    },
    {
      name: 'Events',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Event List',
          url: '/eventlist',
          icon: 'icon-puzzle',
        },
        {
          name: 'Add Event',
          url: '/addevent',
          icon: 'icon-puzzle',
        },
        
        
      ],
    }
  ],
};
