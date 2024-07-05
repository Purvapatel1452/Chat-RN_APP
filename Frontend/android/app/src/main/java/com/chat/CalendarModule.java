package com.chat;


import android.content.Intent;
import android.provider.CalendarContract;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class CalendarModule extends ReactContextBaseJavaModule {
    CalendarModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "CalendarModule";
    }

    @ReactMethod
    public void createCalendarEvent(String name, String location, Callback callback) {
        Log.d("CalendarModule", "Create event called with name: " + name
                + " and location: " + location);
        Integer eventId = 12;
        callback.invoke(eventId);

    }

    @ReactMethod
    public void createCalendarPromise(Promise promise){
        try{
            promise.resolve("Value returned from promise");
        }catch(Exception e){
            promise.reject("Error returned from Promise",e);
        }
    }
@ReactMethod
    public void addEvent(String title, String location, String emails){
        Intent intent=new Intent(Intent.ACTION_INSERT)
                .setData(CalendarContract.Events.CONTENT_URI)
                .putExtra(CalendarContract.Events.TITLE,title.toString())
                .putExtra(CalendarContract.Events.EVENT_LOCATION, location.toString())
                .putExtra(CalendarContract.Events.ALL_DAY, true)
                .putExtra(Intent.EXTRA_EMAIL, emails.toString());


        if(intent.resolveActivity(getCurrentActivity().getPackageManager()) != null){
//            callback.invoke(intent);
            getCurrentActivity().startActivity(intent);
        }
    }

}