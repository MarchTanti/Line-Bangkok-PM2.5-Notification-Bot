function get_pm25() {
    var url = 'http://api.airvisual.com/v2/city?city=Bangkok&state=Bangkok&country=Thailand&key=cb69c9c1-b324-4a48-8a47-2f8b9269fab2';
    var response = UrlFetchApp.fetch(url);
    var data = response.getContentText();
    var pm25 = JSON.parse(data).data.current.pollution.aqius;
    return pm25;
  }
  
  function get_aqi_emoji(aqi) {
    if (aqi <= 50) {
      return '🟢';
    } else if (aqi <= 100) {
      return '🟡';
    } else if (aqi <= 150) {
      return '🟠';
    } else if (aqi <= 200) {
      return '🔴';
    } else if (aqi <= 300) {
      return '🟣';
    } else {
      return '🟤';
    }
  }

  //In this line use your Line_Channel_Access_Token in Line developer web.
  LINE_CHANNEL_ACCESS_TOKEN = {Your_Channel_Access_Token}
  
  function send_line_message(user_id, text) {
    var url = 'https://api.line.me/v2/bot/message/push';
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
    };
    var payload = {
      'to': user_id,
      'messages': [{'type': 'text', 'text': text}]
    };
    var options = {
      'method': 'post',
      'headers': headers,
      'payload': JSON.stringify(payload)
    };
    var response = UrlFetchApp.fetch(url, options);
  }
  
  function schedule_message() {
    var current_time = new Date();
    var pm25 = get_pm25();
    var aqi_emoji = get_aqi_emoji(pm25);
    var rowData = [current_time, pm25, aqi_emoji];
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Historical Data');
    sheet.appendRow(rowData);
  
    var message = '🔔 Current PM2.5 level in Bangkok: ' + pm25 + ' - ' + aqi_emoji;
    //In this line use your line user id in Line developer.
    send_line_message('U4a893cc3ef4509201fc92a651acceb35', message);
  }
  
