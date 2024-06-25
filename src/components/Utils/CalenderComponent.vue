<template>
  <div>
    <Qalendar :events="events" :config="config" />
  </div>
</template>

<script>
import { Qalendar } from "qalendar";

export default {
  name: "CalendarComponent",
  components: {
    Qalendar,
  },
  data() {
    return {
      events: [
        {
          title: "Advanced algebra",
          with: "Chandler Bing",
          time: { start: "2022-05-16 12:05", end: "2022-05-16 13:35" },
          color: "yellow",
          isEditable: true,
          id: "753944708f0f",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
        },
        {
          title: "Ralph on holiday",
          with: "Rachel Greene",
          time: { start: "2022-05-10", end: "2022-05-22" },
          color: "green",
          isEditable: true,
          id: "5602b6f589fc",
        },
      ],
      config: {
        week: {
          startsOn: "monday",
          nDays: 7,
          scrollToHour: 5,
        },
        month: {
          showTrailingAndLeadingDates: false,
        },
        locale: "de-DE",
        style: {
          fontFamily: "Nunito, sans-serif",
        },
        defaultMode: "day",
        isSilent: true,
        showCurrentTime: true,
      },
    };
  },
};
</script>
