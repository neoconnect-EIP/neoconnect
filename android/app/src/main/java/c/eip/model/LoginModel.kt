package c.eip.model

import com.google.gson.annotations.SerializedName

class LoginModel(
    @SerializedName("pseudo")
    var pseudo: String? = "",
    @SerializedName("password")
    var password: String? = ""
)