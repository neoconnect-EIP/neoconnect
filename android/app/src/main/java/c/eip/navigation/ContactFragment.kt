package c.eip.navigation


import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import c.eip.Constants
import c.eip.R
import c.eip.model.Contact
import c.eip.services.UtilsService
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class ContactFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_contact, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        view.findViewById<Button>(R.id.sendContact).setOnClickListener {
            val pseudo = view.findViewById<TextInputEditText>(R.id.nomContactData).text.toString()
            val objet = view.findViewById<TextInputEditText>(R.id.objetContactData).text.toString()
            val message = view.findViewById<TextInputEditText>(R.id.bodyContactData).text.toString()
            val email = view.findViewById<TextInputEditText>(R.id.emailContactData).text.toString()
            sendMessage(pseudo, objet, message, email)
        }
    }

    private fun sendMessage(pseudo: String, objet: String, message: String, email: String) {
        contactData.email = email
        contactData.pseudo = pseudo
        contactData.objet = objet
        contactData.message = message
        val utilsService = retrofit.create(UtilsService::class.java)
        val call = utilsService.sendMessage(contactData)
        call.enqueue(object : Callback<String> {
            override fun onResponse(call: Call<String>, response: Response<String>) {
                if (response.isSuccessful) {
                    Log.i("Contact", "Message successfully send")
                }
            }

            override fun onFailure(call: Call<String>?, t: Throwable) {
                Log.e("Contact:", t.message)
            }
        })
    }

    companion object {
        val contactData = Contact()
        var baseUrl = Constants.BASE_URL
        var retrofit: Retrofit =
            Retrofit.Builder().baseUrl(baseUrl).addConverterFactory(GsonConverterFactory.create())
                .build()
    }
}
