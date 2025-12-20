import toast from "react-hot-toast";

const toastConfirm = (message, onConfirm) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-sm">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            className="btn btn-xs"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>

          <button
            className="btn btn-xs btn-error"
            onClick={() => {
              onConfirm();
              toast.dismiss(t.id);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
    }
  );
};

export default toastConfirm;
