package c.eip.model

import com.google.gson.annotations.SerializedName

class Contact {
    @SerializedName("pseudo")
    var pseudo: String? = ""
    @SerializedName("subject")
    var objet: String? = ""
    @SerializedName("email")
    var email: String? = ""
    @SerializedName("message")
    var message: String? = ""
}