const datePeriod = $('input[name=date-period]');
const $work = $('.c-stat--work');
const $play = $('.c-stat--play');
const $study = $('.c-stat--study');
const $exercise = $('.c-stat--exercise');
const $social = $('.c-stat--social');
const $selfCare = $('.c-stat--self-care');
const $periodStatus = $('#period-status'); // aria-live 영역: 갱신 사실을 스크린 리더에 알림

let period = null;
let isFirstRender = true;

const sectionMap = new Map([
  ['Work', $work],
  ['Play', $play],
  ['Study', $study],
  ['Exercise', $exercise],
  ['Social', $social],
  ['Self Care', $selfCare],
]);

function handleDatePeriodChange(event) {
  const target = event.target;
  period = $(target).val();

  if (period) {
    $.get('./data.json', successFn, 'json').fail(failFn);
  }
}

datePeriod.on('change', handleDatePeriodChange);
handleDatePeriodChange({ target: datePeriod.filter(':checked')[0] });

function successFn(data) {
  const obj = data;
  progress(obj);
}

function failFn(data) {
  const obj = dummyData();

  progress(obj);
}

function progress(obj) {
  if (period === 'daily') {
    const prefix = 'Yesterday - ';
    const suffix = 'hrs';

    modifyStatContent(obj, suffix, prefix);
  } else if (period === 'weekly') {
    const prefix = 'Last Week - ';
    const suffix = 'hrs';

    modifyStatContent(obj, suffix, prefix);
  } else if (period === 'monthly') {
    const prefix = 'Last Month - ';
    const suffix = 'hrs';

    modifyStatContent(obj, suffix, prefix);
  }
}

function modifyStatContent(obj, suffix, prefix) {
  sectionMap.forEach((value, key) => {
    const val = timeFrames(obj, key, period);
    if (val) {
      value.find('.c-stat__hours').text(val.current + suffix);
      value.find('.c-stat__previous').text(prefix + val.previous + suffix);
    }
  });

  announcePeriod();
}

// 첫 렌더링은 알리지 않고, 사용자가 기간을 바꿔 숫자가 갱신된 뒤에만 알린다.
function announcePeriod() {
  if (isFirstRender) {
    isFirstRender = false;
    return;
  }
  const label = datePeriod.filter(':checked').next('.c-filter__label').text();
  $periodStatus.text(`${label} hours shown`);
}

function timeFrames(obj, title, time) {
  const workDaily = obj.find((item) => item.title === title)?.timeframes[time];
  return workDaily;
}

function dummyData() {
  return [
    {
      title: 'Work',
      timeframes: {
        daily: {
          current: 5,
          previous: 7,
        },
        weekly: {
          current: 32,
          previous: 36,
        },
        monthly: {
          current: 103,
          previous: 128,
        },
      },
    },
    {
      title: 'Play',
      timeframes: {
        daily: {
          current: 1,
          previous: 2,
        },
        weekly: {
          current: 10,
          previous: 8,
        },
        monthly: {
          current: 23,
          previous: 29,
        },
      },
    },
    {
      title: 'Study',
      timeframes: {
        daily: {
          current: 0,
          previous: 1,
        },
        weekly: {
          current: 4,
          previous: 7,
        },
        monthly: {
          current: 13,
          previous: 19,
        },
      },
    },
    {
      title: 'Exercise',
      timeframes: {
        daily: {
          current: 1,
          previous: 1,
        },
        weekly: {
          current: 4,
          previous: 5,
        },
        monthly: {
          current: 11,
          previous: 18,
        },
      },
    },
    {
      title: 'Social',
      timeframes: {
        daily: {
          current: 1,
          previous: 3,
        },
        weekly: {
          current: 5,
          previous: 10,
        },
        monthly: {
          current: 21,
          previous: 23,
        },
      },
    },
    {
      title: 'Self Care',
      timeframes: {
        daily: {
          current: 0,
          previous: 1,
        },
        weekly: {
          current: 2,
          previous: 2,
        },
        monthly: {
          current: 7,
          previous: 11,
        },
      },
    },
  ];
}
